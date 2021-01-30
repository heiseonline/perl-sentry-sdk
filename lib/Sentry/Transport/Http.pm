package Sentry::Transport::Http;
use Mojo::Base -base, -signatures;

use Mojo::UserAgent;
use Mojo::Util 'dumper';
use Readonly;
use Sentry::Hub;
use Sentry::Logger 'logger';

Readonly my $SENTRY_API_VERSION => '7';

has _http          => sub { Mojo::UserAgent->new };
has _sentry_client => 'perl-sentry/1.0';
has _sentry_key    => 'b61a335479ff48529d773343287bcdad';
has _project       => 2;
has _headers       => sub($self) {
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
  sub ($self) { 'http://localhost:9000/api/' . $self->_project . '/store/' };

sub send ($self, $payload) {

  # warn 'Payload: ' . dumper($payload);

  my $tx = $self->_http->post($self->_sentry_url => $self->_headers,
    json => $payload);

  logger->log(
    sprintf(
      qq{Sentry request done. Payload: %s\nCode: %d},
      dumper($payload), $tx->res->code
    ),
    __PACKAGE__
  );
  return $tx->res->json;
}

1;
