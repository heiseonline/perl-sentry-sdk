package Sentry::Hub::Scope;
use Mojo::Base -base, -signatures;

use Clone qw();
use Mojo::Util 'dumper';
use Sentry::Severity;
use Time::HiRes;

has breadcrumbs            => sub { [] };
has context                => sub { {} };
has error_event_processors => sub { [] };
has event_processors       => sub { [] };
has extra                  => sub { {} };
has fingerprints           => sub { [] };
has level                  => Sentry::Severity->Info;
has tags             => sub { {} };
has transaction_name => undef;
has user             => undef;

sub set_user ($self, $user) {
  $self->user($user);
}

sub set_extra ($self, $name, $value) {
  $self->extra->{$name} = $value;
}

sub set_extras ($self, $extras) {
  $self->extra = {%{$self->extra}, %{$extras}};
}

sub set_tag ($self, $key, $value) {
  $self->tags->{$key} = $value;
}

sub set_tags ($self, $tags) {
  $self->tags = {%{$self->tags}, %{$tags}};
}

sub set_context ($self, $context) {
  $self->context($context);
}

sub set_level ($self, $level) {
  $self->level($level);
}

sub set_transaction ($self, $transaction_name) {
  $self->transaction_name($transaction_name);
}

sub set_fingerprint ($self, $fingerprints) {
  $self->fingerprints($fingerprints);
}

sub add_event_processor ($self, $event_processor) {
  push $self->event_processors->@*, $event_processor;
}

sub add_error_processor ($self, $error_event_processor) {
  push $self->error_event_processors->@*, $error_event_processor;
}

sub clear($self) {

  # Resets a scope to default values while keeping all registered event
  # processors. This does not affect either child or parent scopes
}

sub add_breadcrumb ($self, $breadcrumb) {
  $breadcrumb->{timestamp} //= time;
  push @{$self->breadcrumbs}, $breadcrumb;
}

sub clear_breadcrumbs($self) {
  $self->breadcrumbs([]);
}

# Applies the scope data to the given event object. This also applies the event
# processors stored in the scope internally. Some implementations might want to
# set a max breadcrumbs count here.
sub apply_to_event ($self, $event, $hint = undef) {
  foreach my $processor ($self->event_processors->@*) {
    $processor->($event, $hint);
  }

  return $event;
}

sub clone ($self) {
  Clone::clone($self);
}

sub update ($self, $fields) {
  $self->$_($fields->{$_}) for keys $fields->%*;
}

1;
