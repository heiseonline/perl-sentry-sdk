use Mojo::Base -strict, -signatures;

use Mojo::File;
# curfile missing in Mojolicious@^8. The dependency shall not be updated for
# the time being. For this reason `curfile` is duplicated for now.
# use lib curfile->sibling('lib')->to_string;
# See https://github.com/mojolicious/mojo/blob/4093223cae00eb516e38f2226749d2963597cca3/lib/Mojo/File.pm#L36
use lib Mojo::File->new(Cwd::realpath((caller)[1]))->sibling('lib')->to_string;

use Mock::Sentry::Cache;
use Mojo::Util 'dumper';
use Sentry::SourceFileRegistry;
use Test::Exception;
use Test::Spec;

describe 'Sentry::SDK' => sub {
  my $registry;
  my $cache;

  before each => sub {
    $cache    = Mock::Sentry::Cache->new;
    $registry = Sentry::SourceFileRegistry->new(_cache => $cache);
  };

  describe 'get_context_lines()' => sub {
    it 'does not throw if file does not exist' => sub {
      my $lines = $registry->get_context_lines('does-not-exist', 1);
      $registry->get_context_lines('does-not-exist', 1);
    };

    it 'uses the context line cache even for not existing files' => sub {
      $registry->get_context_lines('does-not-exist', 1);
      $registry->get_context_lines('does-not-exist', 1);
      $registry->get_context_lines('does-not-exist', 1);

      is(scalar $cache->set_calls->@*, 1);
    };
  };
};

runtests;

