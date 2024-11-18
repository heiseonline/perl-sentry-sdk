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
use Sentry::Stacktrace::Frame;
use Mock::Sentry::SourceFileRegistry;
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

describe 'Sentry::Stacktrace::Frame' => sub {
  my $home;
  my $frame;
  my $frame_json;

  before each => sub {
    $home = Mojo::Home->new->detect;
    $frame = Sentry::Stacktrace::Frame->new(
      _source_file_registry => Mock::Sentry::SourceFileRegistry->new,
      module => 'My::Module',
      filename => $home->child('My', 'Module.pm')->to_string,
      line => 1,
      subroutine => 'my_method',
    );
    $frame_json = Mojo::JSON::decode_json Mojo::JSON::encode_json $frame;
  };

  it 'correctly identifies in-app frames' => sub {
    ok $frame_json->{in_app};

    $frame->filename('/external/External/Module.pm');
    $frame_json = Mojo::JSON::decode_json Mojo::JSON::encode_json $frame;
    ok !$frame_json->{in_app};

    $frame->filename($home->child('.cpan', 'Module.pm')->to_string);
    $frame_json = Mojo::JSON::decode_json Mojo::JSON::encode_json $frame;
    ok !$frame_json->{in_app};
  };

  it 'has file context' => sub {
    is $frame_json->{pre_context}, 'pre context';
    is $frame_json->{context_line}, 'context line';
    is $frame_json->{post_context}, 'post context';
  };

  it 'has relative filename' => sub {
    is $frame_json->{file_name}, 'My/Module.pm';
  };
};

runtests;

