package Mock::Sentry::Transport::HTTP;
use Mojo::Base -base, -signatures;

has events_sent => sub { [] };

sub send ($self, $event) {
  push $self->events_sent->@*, $event;
}

1;
