#!/usr/bin/env perl
use Mojo::Base -strict;

use lib qw(lib example);
use Mojo::Util 'dumper';
use MyIntegration;
use Sentry;
use Sentry::Hub;
use Sentry::Severity;
use Try::Tiny;

sub main {
  my $dsn = 'http://b61a335479ff48529d773343287bcdad@localhost:9000/2';

  Sentry->init({
    dsn          => $dsn,
    environment  => 'my environment',
    release      => '1.0.0',
    dist         => '12345',
    integrations => [MyIntegration->new],
  });

  Sentry->configure_scope(sub {
    my $scope = shift;
    $scope->set_tag(foo => 'bar');
  });
  Sentry->configure_scope(sub {
    my $scope = shift;
    $scope->set_tag(bar => 'baz');
  });
  Sentry->add_breadcrumb({
    message => 'my message', level => Sentry::Severity->Warning,
  });

  # Integration SDK
  my $hub = Sentry::Hub->get_current_hub();
  $hub->with_scope(sub {
    my $scope = shift;
    $scope->set_extra(arguments => [1, 2, 3]);
    $scope->add_breadcrumb({
      type     => 'navigation',
      category => 'navigation',
      data     => {from => '/a', to => '/b'}
    });
    $hub->capture_message('ich bin eine SDK integration message');
  });

  Sentry->capture_message('hohoho', Sentry::Severity->Warning);

  use ScriptLib;
  my $s = ScriptLib->new(foo => 'my foo');
  try {
    $s->foo1('foo1 value');
  }
  catch {
    Sentry->capture_exception($_);
  };
}

main();
