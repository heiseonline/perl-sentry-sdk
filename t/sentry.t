use Mojo::Base -strict;

use Test::Spec;
use Sentry;

describe 'Sentry' => sub {
  my $sentry;

  before each => sub {
    $sentry = Sentry->new;
  };

  it 'foo' => sub {
    is(1, 1);
  };
};

runtests;
