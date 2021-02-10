use Mojo::Base -strict;

use Test::More;

plan skip_all => 'set TEST_POD to enable this test (developer only!)'
  unless $ENV{TEST_POD} || $ENV{TEST_ALL};
plan skip_all => 'Test::Pod::Coverage 1.04+ required for this test!'
  unless eval 'use Test::Pod::Coverage 1.04; 1';

# all_pod_coverage_ok();

pod_coverage_ok('Sentry::SDK');
pod_coverage_ok('CGI::Application::Plugin::Sentry');
pod_coverage_ok('Mojolicious::Plugin::SentrySDK');

done_testing;
