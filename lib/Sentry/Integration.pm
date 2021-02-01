package Sentry::Integration;
use Mojo::Base -base, -signatures;

use Sentry::Hub;
use Sentry::Integration::MojoUserAgent;
use Sentry::Integration::LwpUserAgent;

my @Global_integrations = (
  Sentry::Integration::MojoUserAgent->new,
  Sentry::Integration::LwpUserAgent->new,
);

sub _add_global_event_processor ($cb) {
  Sentry::Hub->get_current_scope->add_event_processor($cb);
}

sub setup ($package, $custom_integrations = []) {
  my @all_integrations = (@Global_integrations, $custom_integrations->@*);
  foreach my $integration (@all_integrations) {
    $integration->setup_once(
      Sentry::Integration->can('_add_global_event_processor'),
      Sentry::Hub->can('get_current_hub'));
  }
}

1;
