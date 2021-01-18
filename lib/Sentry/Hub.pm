package Sentry::Hub;
use Mojo::Base -base, -signatures;

use Mojo::Util 'dumper';
use Sentry::Severity;
use Sentry::Hub::Scope;
use Sentry::Util qw(uuid4);
use Try::Tiny;

my $Instance;

has _event_id => uuid4();
has _stack    => sub { [{}] };
has client    => undef;
has scopes    => sub { [Sentry::Hub::Scope->new] };

# has _root_scope =>

sub init ($package, $options) {
  $Instance = Sentry::Hub->new($options);
}

sub bind_client ($self, $client) {
  $self->client($client);
  $client->setup_integrations();
}

sub _get_top_scope($self) {
  return @{$self->scopes}[0];
}

sub get_current_scope($package) {
  return @{$package->get_current_hub()->scopes}[-1];
}

sub get_current_hub {
  $Instance //= Sentry::Hub->new();
  return $Instance;
}

sub configure_scope ($self, $cb) {
  $cb->($self->get_current_scope);
}

sub push_scope($self) {
  my $scope = $self->get_current_scope->clone;
  push @{$self->scopes}, $scope;
  return $scope;
}
sub pop_scope($self) { pop @{$self->scopes} }

sub with_scope ($self, $cb) {
  my $scope = $self->push_scope;

  try {
    $cb->($scope);
  }
  finally {
    $self->pop_scope;
  };
}

sub _invoke_client ($self, $method, @args) {
  my $client = $self->client;
  my $scope  = $self->get_current_scope;

  if ($client->can($method)) {
    $client->$method(@args, $scope);
  }
  else {
    warn "Unknown method: $method";
  }
}

sub capture_message ($self, $message, $level = Sentry::Severity->Info,
  $hint = undef)
{
  my $event_id = $self->_event_id;

  $self->_invoke_client('capture_message', $message, $level,
    {event_id => $event_id});

  return $event_id;
}

sub capture_exception ($self, $exception, $hint = undef) {
  my $event_id = $self->_event_id;

  $self->_invoke_client('capture_exception', $exception,
    {event_id => $event_id});

  return $event_id;
}

sub add_breadcrumb ($self, $crumb, $hint = undef) {
  $self->get_current_scope->add_breadcrumb($crumb);
}

sub run ($self, $cb) {
  $cb->($self);
}

1;
