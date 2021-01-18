use Mojo::Base -strict;

use Sentry::Profiler;
use Test::Spec;

{

}

describe 'Profiler' => sub {
  my $profiler;

  before each => sub {
    $profiler = Sentry::Profiler->new;
  };

  it 'foo ' => sub {
    $profiler->begin_scope();
  };
};

runtests;
