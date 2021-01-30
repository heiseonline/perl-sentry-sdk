package Sentry::Integration::MojoUserAgent;
use Mojo::Base 'Sentry::Integration::Base', -signatures;

use Mojo::Loader qw(load_class);
use Mojo::Util qw(dumper monkey_patch);
use Sub::Util 'set_subname';

has breadcrumbs => 1;
has tracing     => 1;

my %Patched = ();

sub around ($package, $method, $cb) {
  my $key = $package . ':' . $method;
  return if $Patched{$key};

  if (my $exception = load_class $package) {
    warn $exception;
    return;
  }

  my $orig = $package->can($method);
  warn 'PATCH';
  monkey_patch $package, $method => sub { $cb->($orig, @_) };

  $Patched{$key} = 1;
}

sub measure ($cb, @args) {
  use Time::HiRes 'time';
  my $t0     = time;
  my $result = $cb->(@args);
  return {return_value => $result, duration => (time - $t0) * 1000};
}

sub setup_once ($self, $add_global_event_processor, $get_current_hub) {
  return if (!$self->breadcrumbs && !$self->tracing);

  around(
    'Mojo::UserAgent',
    start => sub ($orig, $ua, $tx, $cb) {
      my $url = $tx->req->url;

      # Exclude Requests to the Sentry server
      return $orig->($ua, $tx, $cb)
        if $tx->req->headers->header('x-sentry-auth');

      my $result = measure($orig, $ua, $tx, $cb);

      my $hub = $get_current_hub->();
      $hub->add_breadcrumb({
        type     => 'http',
        category => 'xhr',
        data     => {
          url         => $tx->req->url->to_string,
          method      => $tx->req->method,
          status_code => $tx->res->code,
          reason      => "OK"
        }
      });

      # warn "### DURATION: " . $result->{duration} . "($url)";
      # warn dumper($tx->req->headers);

      return $result->{return_value};
    }
  );

  $add_global_event_processor->(
    sub ($event, $hint) {

      # warn 'PROCESS' . dumper($event);

      # warn $get_current_hub->();
    }
  );

  # my $hub = $get_current_hub->();
}

1;
