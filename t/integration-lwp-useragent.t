use Mojo::Base -strict, -signatures;

use Mojo::File;
# curfile missing in Mojolicious@^8. The dependency shall not be updated for
# the time being. For this reason `curfile` is duplicated for now.
# use lib curfile->sibling('lib')->to_string;
# See https://github.com/mojolicious/mojo/blob/4093223cae00eb516e38f2226749d2963597cca3/lib/Mojo/File.pm#L36
use lib Mojo::File->new(Cwd::realpath((caller)[1]))->sibling('lib')->to_string;

use HTTP::Status ':constants';
use Mojo::Util qw(dumper);
use Scalar::Util 'looks_like_number';
use Sentry::Hub;
use Sentry::Integration::LwpUserAgent;
use Sentry::Tracing::Span;
use Test::Spec;

describe 'Sentry::Integration::LwpUserAgent' => sub {
  my $http;
  my $integration;
  my $hub;

  before each => sub {
    $hub = Sentry::Hub->new;

    $integration = Sentry::Integration::LwpUserAgent->new(
      _package_name => 'Mock::LWP::UserAgent',
      tracing       => 1,
    );

    $integration->setup_once(sub { }, sub {$hub});

    $http = Mock::LWP::UserAgent->new(next_status_code => HTTP_CREATED);
  };

  it 'adds a single breadcrumb' => sub {
    $http->get('http://example.com/');

    my @breadcrumbs = $hub->get_current_scope->breadcrumbs->@*;
    is scalar @breadcrumbs, 1;
  };

  it 'sets request information as breadcrumb item' => sub {
    $http->get('http://example.com/');

    my %crumb = $hub->get_current_scope->breadcrumbs->[0]->%*;
    ok looks_like_number $crumb{timestamp};
    is $crumb{category}          => 'LWP::UserAgent';
    is $crumb{data}{status_code} => HTTP_CREATED;
    is $crumb{data}{url}         => 'http://example.com/';
    is $crumb{type}              => 'http';
  };

  it 'sets the Sentry-Trace request header' => sub {
    my $scope = $hub->get_current_scope;
    my $span  = Sentry::Tracing::Span->new(tags => { foo => 'bar' });
    $scope->set_span($span);

    $http->get('http://example.com/');

    my %headers = $span->spans->[0]->data->{headers}->flatten;

    like $headers{'Sentry-Trace'}, qr{\A [a-z0-9]{32} - [a-z0-9]{16} \z}xms;
  };
};

runtests;
