use Mojo::Base -strict, -signatures;

use Mojo::File;
# curfile missing in Mojolicious@^8. The dependency shall not be updated for
# the time being. For this reason `curfile` is duplicated for now.
# use lib curfile->sibling('lib')->to_string;
# See https://github.com/mojolicious/mojo/blob/4093223cae00eb516e38f2226749d2963597cca3/lib/Mojo/File.pm#L36
use lib Mojo::File->new(Cwd::realpath((caller)[1]))->sibling('lib')->to_string;

use Config qw(%Config);
use Mock::Sentry::SourceFileRegistry;
use Mojo::Exception;
use Mojo::Home;
use Mojo::JSON qw(decode_json encode_json);
use Sentry::Stacktrace::Frame;
use Test::Exception;
use Test::Spec;

describe 'Sentry::Stacktrace::Frame' => sub {
  my $home;
  my $frame;
  my $frame_json;

  before each => sub {
    $home  = Mojo::Home->new->detect;
    $frame = Sentry::Stacktrace::Frame->new(
      _source_file_registry => Mock::Sentry::SourceFileRegistry->new,
      module                => 'My::Module',
      filename              => $home->child('My', 'Module.pm')->to_string,
      line                  => 1,
      subroutine            => 'my_method',
    );
    $frame_json = decode_json encode_json $frame;
  };

  describe 'External frames' => sub {
    it 'absolute external path' => sub {
      ok $frame_json->{in_app};

      $frame->filename('/external/External/Module.pm');
      $frame_json = decode_json encode_json $frame;
      ok !$frame_json->{in_app};
    };

    it 'CPAN modules' => sub {
      ok $frame_json->{in_app};

      $frame->filename(
        $home->child($Config{siteprefix}, 'Module.pm')->to_string);

      $frame_json = decode_json encode_json $frame;
      ok !$frame_json->{in_app};
    };
  };

  it 'correctly identifies local frames as in-app' => sub {
    $frame->filename('lib/My/Module.pm');
    $frame_json = decode_json encode_json $frame;
    ok $frame_json->{in_app};
  };

  it 'has file context' => sub {
    is $frame_json->{pre_context},  'pre context';
    is $frame_json->{context_line}, 'context line';
    is $frame_json->{post_context}, 'post context';
  };

  it 'has relative filename' => sub {
    is $frame_json->{file_name}, 'My/Module.pm';
  };
};

runtests;

