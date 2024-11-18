use Mojo::Base -strict, -signatures;

use Mojo::File;
# curfile missing in Mojolicious@^8. The dependency shall not be updated for
# the time being. For this reason `curfile` is duplicated for now.
# use lib curfile->sibling('lib')->to_string;
# See https://github.com/mojolicious/mojo/blob/4093223cae00eb516e38f2226749d2963597cca3/lib/Mojo/File.pm#L36
use lib Mojo::File->new(Cwd::realpath((caller)[1]))->sibling('lib')->to_string;

use HTTP::Status qw(:constants);
use Mock::Mojo::UserAgent;
use Mojo::Util 'dumper';
use Mojolicious::Plugin::SentrySDK;
use Sentry::SDK;
use Test::Mojo;
use Test::Spec;

{

  package MyApp;
  use Mojo::Base 'Mojolicious', -signatures;

  use Mojo::UserAgent;

  sub startup ($self) {
    $self->plugin(
      'SentrySDK',
      {
        dsn =>
          'http://ff21cbe6ddaf4314833eabd2075e38e3@example.com/foo/bar/2',
        traces_sample_rate => 1,
      }
    );

    $self->routes->get('/')->to('foo#index');
    $self->routes->get('/adds-breadcrumb')->to('foo#adds_breadcrumb');
    my $route = $self->routes->get('/dies')->to(controller => 'foo');
    $route->get('')->to(action => 'dies');
    $route->get('/nested/:foo')->to(action => 'dies');
  }

  package MyApp::Controller::Foo;
  use Mojo::Base 'Mojolicious::Controller', -signatures;

  sub index ($self) {
    use Try::Tiny;
    Sentry::SDK->add_breadcrumb({ category => 'foo', message => 'hello' });
    Sentry::SDK->capture_message('hello');

    $self->render(text => 'Hello World!');
  }

  sub adds_breadcrumb ($self) {
    Sentry::SDK->add_breadcrumb({ category => 'foo', message => 'hello' });
    Sentry::SDK->capture_message('hello');
    $self->render(text => 'breadcrumb added!');
  }

  sub dies { die 'boom' }
}

describe 'Mojolicious::Plugin::SentrySDK' => sub {
  my $t;
  my $http;

  before each => sub {
    $http = Mock::Mojo::UserAgent->new;

    $t = Test::Mojo->new('MyApp');

    $t->app->hook(
      before_server_start => sub {
        my $client = Sentry::Hub->get_current_hub->client;
        $client->_transport->_http($http);
      }
    );
  };

  it 'does not crash the application' => sub {
    $t->get_ok('/')->status_is(HTTP_OK)->content_is('Hello World!');
  };

  it 'captures exceptions' => sub {
    $t->get_ok('/dies')->status_is(HTTP_INTERNAL_SERVER_ERROR);

    # Notification; Transaction
    is $http->requests->@*, 2;
    isa_ok($http->requests->[0]{body}, 'HASH');
    is ref($http->requests->[1]{body}), '';

    ok exists $http->requests->[0]{body}{exception};

    is $http->requests->[0]{body}{level}, Sentry::Severity->Error;
  };

  it 'registers breadcrumbs' => sub {
    # Sentry-Requests are ignored in the MojoUserAgent integration
    my %do_not_track = ('x-sentry-auth' => 1);
    %do_not_track = ();
    $t->get_ok('/adds-breadcrumb' => \%do_not_track)->status_is(HTTP_OK)
      ->content_is('breadcrumb added!');

    # Notification; Transaction
    is $http->requests->@*, 2;

    my %event = $http->requests->[0]{body}->%*;

    is $event{message} => 'hello';
    is $event{level}   => 'info';

    # is $event{breadcrumbs}->@*           => 1;
    is $event{breadcrumbs}[-1]{category} => 'foo';
    is $event{breadcrumbs}[-1]{message}  => 'hello';
  };

  it 'nested route has full transaction name' => sub {
    $t->get_ok('/dies/nested/1')->status_is(HTTP_INTERNAL_SERVER_ERROR);
    is $http->requests->@*, 2;

    my %event = $http->requests->[0]{body}->%*;

    is $event{tags}{transaction} => '/dies/nested/:foo';

  }
};

runtests;
