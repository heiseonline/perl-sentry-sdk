use Mojo::Base -strict, -signatures;

use Mojo::File;
# curfile missing in Mojolicious@^8. The dependency shall not be updated for
# the time being. For this reason `curfile` is duplicated for now.
# use lib curfile->sibling('lib')->to_string;
# See https://github.com/mojolicious/mojo/blob/4093223cae00eb516e38f2226749d2963597cca3/lib/Mojo/File.pm#L36
use lib Mojo::File->new(Cwd::realpath((caller)[1]))->sibling('lib')->to_string;

use Mojo::Template;
use Sentry::Hub;
use Sentry::Integration::MojoTemplate;
use Sentry::Tracing::Span;
use Sentry::Util qw(restore_original);
use Test::Spec;

describe 'Sentry::Integration::MojoTemplate' => sub {
  my $integration;
  my $hub;

  before each => sub {
    $hub = Sentry::Hub->new;

    $integration = Sentry::Integration::MojoTemplate->new(
      tracing        => 1,
      fix_stacktrace => 1,
    );

    $integration->setup_once(sub { }, sub {$hub});
  };

  after each => sub {
    restore_original 'Mojo::Template', 'render';
  };

  it 'creates a span when rendering template' => sub {
    my $scope = $hub->get_current_scope;
    my $span  = Sentry::Tracing::Span->new();
    $scope->set_span($span);

    my $mt = Mojo::Template->new(name => 'tmpl foo');
    $mt->render('foo');

    is scalar $span->spans->@*, 1;
    my %tmpl_span = $span->spans->[0]->%*;
    is $tmpl_span{description}, 'tmpl foo';
    is $tmpl_span{op},          'mojo.template';
    is_deeply $tmpl_span{data}, { compiled => 'no' };
  };

  it 'fixes stacktrace' => sub {
    $integration->fix_stacktrace(1);
    my $scope = $hub->get_current_scope;
    my $span  = Sentry::Tracing::Span->new();
    $scope->set_span($span);

    my $mt = Mojo::Template->new(
      name      => 'tmpl foo',
      namespace => 'Mojo::Template::Sandbox::deadbeef'
    );
    my $output = $mt->render('<% die "boom"; %>');

    is ref $output, 'Mojo::Exception';
    my ($module, $filename, undef, $subroutine) = $output->frames->[0]->@*;
    is $module,     '';
    is $filename,   'tmpl foo';
    is $subroutine, '';
  };

  it 'does not fix stacktrace when fix_stacktrace is false' => sub {
    $integration->fix_stacktrace(0);
    my $scope = $hub->get_current_scope;
    my $span  = Sentry::Tracing::Span->new();
    $scope->set_span($span);

    my $mt = Mojo::Template->new(
      name      => 'tmpl foo',
      namespace => 'Mojo::Template::Sandbox::deadbeef'
    );
    my $output = $mt->render('<% die "boom"; %>');

    is ref $output, 'Mojo::Exception';
    my ($module, $filename, undef, $subroutine) = $output->frames->[0]->@*;
    is $module,     'Mojo::Template::Sandbox::deadbeef';
    is $filename,   'tmpl foo';
    is $subroutine, 'Mojo::Template::__ANON__';
  };
};

runtests;
