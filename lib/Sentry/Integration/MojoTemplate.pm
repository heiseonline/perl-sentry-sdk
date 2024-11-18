package Sentry::Integration::MojoTemplate;
use Mojo::Base 'Sentry::Integration::Base', -signatures;

use Try::Tiny;
use Sentry::Util 'around';

has tracing        => 1;
has fix_stacktrace => 1;

sub setup_once ($self, $add_global_event_processor, $get_current_hub) {
  around(
    'Mojo::Template',
    render => sub ($orig, $mojo_template, @args) {
      my $hub         = $get_current_hub->();
      my $parent_span = $self->tracing && $hub->get_current_scope->get_span;
      my $output;
      $hub->with_scope(sub ($scope) {
        my $namespace = $mojo_template->namespace;

        my $span;
        if ($parent_span) {
          $span = $parent_span->start_child({
            op          => 'mojo.template',
            description => $mojo_template->name,
            data => { compiled => $mojo_template->compiled ? 'yes' : 'no', },
          });
          $scope->set_span($span);
        }

        try {
          $output = $orig->($mojo_template, @args);
          if ( $self->fix_stacktrace
            && ref $output
            && $output->isa('Mojo::Exception')) {
            _fix_template_stack_frames($namespace, $output);
          }
        } finally {
          $span->finish() if $span;
        };
      });
      return $output;
    }
  );
}

sub _fix_template_stack_frames($namespace, $exc) {
  for my $frame ($exc->frames->@*) {
    # Frames coming from Mojo templates will have their module set to
    # $namespace which is not very useful since it will be the same for all
    # templates. Additionally, if using Mojolicious::Plugin::EPRenderer, the
    # namespace will contain a hash value, which means it will mess up issue
    # grouping.
    # Remove module and subroutine from the frame so that Sentry falls back
    # to using the filename in the UI and for grouping.
    if ($frame->[0] && $frame->[0] eq $namespace && $frame->[1]) {
      $frame->[0] = '';    # module
      $frame->[3] = '';    # subroutine
    } elsif ($frame->[3]) {
      # Remove namespace from subroutine name
      $frame->[3] =~ s/^${namespace}:://;
    }
  }
}

1;
