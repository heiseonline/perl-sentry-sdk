package Sentry::Integration::MojoUserAgent;
use Mojo::Base 'Sentry::Integration::Base', -signatures;

use Mojo::Loader qw(load_class);
use Mojo::Util qw(dumper monkey_patch);
use Sub::Util 'set_subname';

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

sub setup_once ($self, $add_global_event_processor, $get_current_hub) {
  $add_global_event_processor->(
    sub ($event, $hint) {
      warn 'PROCESS';
      around(
        'Mojo::UserAgent',
        start => sub ($orig, @args) {
          use Time::HiRes 'time';
          my $t0     = time;
          my $result = $orig->(@args);
          warn '### ' . ((time - $t0) * 1000);
          return $result;
        }
      );

      # warn $get_current_hub->();
    }
  );

  # my $hub = $get_current_hub->();
}

1;
