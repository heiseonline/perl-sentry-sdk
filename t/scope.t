use Mojo::Base -strict, -signatures;

use Mojo::File;
# curfile missing in Mojolicious@^8. The dependency shall not be updated for
# the time being. For this reason `curfile` is duplicated for now.
# use lib curfile->sibling('lib')->to_string;
# See https://github.com/mojolicious/mojo/blob/4093223cae00eb516e38f2226749d2963597cca3/lib/Mojo/File.pm#L36
use lib Mojo::File->new(Cwd::realpath((caller)[1]))->sibling('lib')->to_string;

use Mojo::Util 'dumper';
use Sentry::Hub::Scope;
use Sentry::Severity;
use Sentry::Tracing::Span;
use Sentry::Tracing::Transaction;
use Test::Exception;
use Test::Spec;

describe 'Sentry::Hub::Scope' => sub {
  my $scope;
  my $span;
  my $tx;

  before each => sub {
    # Reset global event processors
    splice Sentry::Hub::Scope::get_global_event_processors()->@*, 0,
      Sentry::Hub::Scope::get_global_event_processors()->@*;

    $tx   = Sentry::Tracing::Transaction->new();
    $span = Sentry::Tracing::Span->new(
      { transaction => $tx, request => { url => 'http://example.com' } });
    $scope = Sentry::Hub::Scope->new({ span => $span });
  };

  describe 'apply_to_event()' => sub {

    it 'sets the request payload', sub {
      my $event = $scope->apply_to_event({});

      is_deeply $event->{request}, { url => 'http://example.com' };
    };

    describe 'level' => sub {
      it 'has no default level' => sub {
        my $event = $scope->apply_to_event({});

        is $event->{level}, undef;
      };

      it 'overrides the event level' => sub {
        $scope->set_level(Sentry::Severity->Warning);
        my $event
          = $scope->apply_to_event({ level => Sentry::Severity->Fatal });

        is $event->{level}, Sentry::Severity->Warning;
      };
    };
  };

  describe 'global event processors' => sub {
    it 'defaults to an empty array ref' => sub {
      is_deeply Sentry::Hub::Scope::get_global_event_processors, [];
    };

    it 'adds an event processor' => sub {
      my $processor = sub ($event, $hint = undef) {
        return undef;
      };
      Sentry::Hub::Scope::add_global_event_processor($processor);

      is_deeply Sentry::Hub::Scope::get_global_event_processors, [$processor];
    };

    it 'uses the global event processor' => sub {
      my $processor = sub ($event, $hint = undef) {
        $event->{foo} = 'bar';
        return $event;
      };
      Sentry::Hub::Scope::add_global_event_processor($processor);

      my $event
        = $scope->apply_to_event({ level => Sentry::Severity->Fatal });

      is $event->{foo}, 'bar';
    };
  };

  describe 'set_extras' => sub {
    it 'set_extras should not crash' => sub {
      lives_ok { Sentry::Hub::Scope->new->set_extras({ foo => 'bar' }) };
    };
  };

  describe 'add_breadcrumb' => sub {
    it 'limits breadcrumb items' => sub {
      local $ENV{SENTRY_MAX_BREADCRUMBS} = 2;

      $scope->add_breadcrumb({ message => 'foo' });
      $scope->add_breadcrumb({ message => 'bar' });
      $scope->add_breadcrumb({ message => 'baz' });

      is scalar $scope->breadcrumbs->@*,      2;
      is $scope->breadcrumbs->[0]->{message}, 'bar';
      is $scope->breadcrumbs->[1]->{message}, 'baz';
    };
  };
};

runtests;
