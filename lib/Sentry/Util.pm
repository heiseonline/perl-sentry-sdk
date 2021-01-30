package Sentry::Util;
use Mojo::Base -strict, -signatures;

use Exporter qw(import);
use UUID::Tiny ':std';

our @EXPORT_OK = qw(uuid4 truncate merge);

sub uuid4 {
  my $uuid = create_uuid_as_string(UUID_V4);
  $uuid =~ s/-//g;
  return $uuid;
}

sub truncate ($string, $max = 0) {
  return $string if (ref($string) || $max == 0);

  return length($string) <= $max ? $string : substr($string, 0, $max) . '...';
}

sub merge ($target, $source, $key) {
  $target->{$key} = {($target->{$key} // {})->%*, ($source->{$key} // {})->%*};
}

1;
