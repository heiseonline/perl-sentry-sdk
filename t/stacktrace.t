use Mojo::Base -strict, -signatures;

use Mojo::File;
# curfile missing in Mojolicious@^8. The dependency shall not be updated for
# the time being. For this reason `curfile` is duplicated for now.
# use lib curfile->sibling('lib')->to_string;
# See https://github.com/mojolicious/mojo/blob/4093223cae00eb516e38f2226749d2963597cca3/lib/Mojo/File.pm#L36
use lib Mojo::File->new(Cwd::realpath((caller)[1]))->sibling('lib')->to_string;

use Mojo::Exception;
use Mojo::Home;
use Mojo::JSON;
use Sentry::Stacktrace;
use Test::Exception;
use Test::Spec;

{

  package My::Exception;
  use Mojo::Base -base;
}

describe 'Sentry::SDK' => sub {
  my $stacktrace;
  my $exception;

  before each => sub {
    $exception = Mojo::Exception->new('my exception');
    $exception->frames([
      ['My::Module', 'MyModule.pm', 1, 'my_method'],
      ['My::Module', 'MyModule.pm', 2, 'my_method2'],
    ]);

    $stacktrace = Sentry::Stacktrace->new(
      exception    => $exception,
      frame_filter => sub {1},
    );
  };

  describe 'prepare_frames()' => sub {
    it 'filters frames' => sub {
      is scalar $stacktrace->prepare_frames->@*, 2;
    };

    it
      'does not throw if `exception` is an exception object other than Mojo::Exception'
      => sub {
        $stacktrace->exception(My::Exception->new);
        lives_ok { $stacktrace->prepare_frames };
      };
  };
};

runtests;

