package Sentry::Cache;
use Mojo::Base -base, -signatures;

has _cache => sub { {} };

my $Instance;

sub get_instance ($package) {
  $Instance //= $package->new;
  return $Instance;
}

sub set ($self, $key, $value) {
  $self->_cache->{$key} = $value;
}

sub get ($self, $key) {
  return $self->_cache->{$key};
}

# `has` is taken by Mojo::Base, so we have to use a different name
sub exists ($self, $key) {
  return exists $self->_cache->{$key};
}

1;
