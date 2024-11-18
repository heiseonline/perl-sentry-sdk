package Mock::Sentry::SourceFileRegistry;
use Mojo::Base -base, -signatures;

has requests => sub { [] };

sub get_context_lines ($self, $file, $line) {
  push $self->requests->@*, { file => $file, line => $line };
  return {
    pre_context  => 'pre context',
    context_line => 'context line',
    post_context => 'post context',
  };
}

1;
