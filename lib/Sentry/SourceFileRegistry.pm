package Sentry::SourceFileRegistry;
use Mojo::Base -base, -signatures;

use Mojo::File;
use Mojo::Util 'dumper';
use Sentry::Cache;
use Sentry::SourceFileRegistry::ContextLine;

has _cache => sub { Sentry::Cache->get_instance };

sub _get_cached_context_line ($self, $file) {
  if (!$self->_cache->exists($file)) {
    my $content = -e $file ? Mojo::File->new($file)->slurp : undef;

    my $context
      = Sentry::SourceFileRegistry::ContextLine->new(content => $content);

    $self->_cache->set($file, $context);
  }

  return $self->_cache->get($file);
}

sub get_context_lines ($self, $file, $line) {
  return $self->_get_cached_context_line($file)->get($line);
}

1;
