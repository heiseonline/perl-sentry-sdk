package Sentry::Util;
use Mojo::Base -strict, -signatures;

use Exporter qw(import);
use UUID::Tiny ':std';

our @EXPORT_OK = qw(uuid4 );

sub uuid4 {
  my $uuid = create_uuid_as_string(UUID_V4);
  $uuid =~ s/-//g;
  return $uuid;
}


1;
