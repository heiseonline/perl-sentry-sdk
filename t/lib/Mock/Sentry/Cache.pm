package Mock::Sentry::Cache;
use Mojo::Base 'Sentry::Cache', -signatures;

has set_calls => sub { [] };

sub set($self, $key, $value) {
  push $self->set_calls->@*, [$key, $value];
  return $self->SUPER::set($key, $value);
}

1;
