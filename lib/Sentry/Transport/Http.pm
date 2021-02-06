package Sentry::Transport::Http;
use Mojo::Base -base, -signatures;

use HTTP::Status qw(:constants);
use Mojo::UserAgent;
use Mojo::Util 'dumper';
use Readonly;
use Sentry::Envelope;
use Sentry::Hub;
use Sentry::Logger 'logger';

Readonly my $SENTRY_API_VERSION => '7';

has _http          => sub { Mojo::UserAgent->new };
has _sentry_client => 'perl-sentry/1.0';
has _sentry_key    => 'b61a335479ff48529d773343287bcdad';
has _project       => 2;
has _headers       => sub ($self) {
  my @header = (
    "Sentry sentry_version=$SENTRY_API_VERSION",
    "sentry_client=" . $self->_sentry_client,
    'sentry_key=' . $self->_sentry_key,
  );

  # my $pass = $self->dsn->pass;
  # push @header, "sentry_secret=$pass" if $pass;

  return {
    'Content-Type'  => 'application/json',
    'X-Sentry-Auth' => join(', ', @header),
  };
};
has _sentry_url =>
  sub ($self) { 'http://localhost:9000/api/' . $self->_project };

sub send ($self, $payload) {
  my $is_transaction = ($payload->{type} // '') eq 'transaction';
  my $endpoint       = $is_transaction ? 'envelope' : 'store';
  my $tx;
  my $url = $self->_sentry_url . "/$endpoint/";

  if ($is_transaction) {
    my $envelope = Sentry::Envelope->new(
      event_id => $payload->{event_id},
      body     => $payload,
    );
    $payload = $envelope->serialize;
    $tx      = $self->_http->post($url => $self->_headers, $payload);
  } else {
    $tx = $self->_http->post($url => $self->_headers, json => $payload);
  }

  logger->log(
    sprintf(
      qq{Sentry request done. Payload: \n<<<<<<<<<<<<<<\n%s\n<<<<<<<<<<<<<<\nCode: %d},
      ref($payload) ? dumper($payload) : $payload,
      $tx->res->code
    ),
    __PACKAGE__
  );

  if (($tx->res->code // 0) == HTTP_BAD_REQUEST) {
    logger->error($tx->res->body);
  }

  return $tx->res->json;
}

1;
