package Sentry::Integration::MojoTemplate;
use Mojo::Base 'Sentry::Integration::Base', -signatures;

use Try::Tiny;
use Sentry::Util 'around';

has tracing => 1;

sub setup_once ($self, $add_global_event_processor, $get_current_hub) {
  return if !$self->tracing;

  around(
    'Mojo::Template',
    render => sub ($orig, $mojo_template, @args) {
      my $hub = $get_current_hub->();
      my $parent_span = $hub->get_scope->get_span;
      my $output;
      $hub->with_scope(sub {
        my $span;
        if ($parent_span) {
          $span = $parent_span->start_child({
              op          => 'mojo.template',
              description => $mojo_template->name,
              data        => {
                compiled => $mojo_template->compiled ? 'yes' : 'no',
              },
          });
        }
        $hub->get_scope->set_span($span);

        try {
          $output = $orig->($mojo_template, @args);
        } finally {
          $span->finish() if $span;
        };
      });
    }
  );
}

1;
