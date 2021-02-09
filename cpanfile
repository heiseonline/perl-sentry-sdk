requires 'Clone';
requires 'Cpanel::JSON::XS';
requires 'HTTP::Status';
requires 'IO::Socket::Socks';
requires 'IO::Socket::SSL';
requires 'Mojolicious';
requires 'Net::DNS::Native';
requires 'Readonly';
requires 'Role::Tiny';
requires 'Time::HiRes';
requires 'Try::Tiny';
requires 'UUID::Tiny';

on 'test' => sub {
  requires 'Perl::Critic';
  requires 'Test::Pod';
  requires 'Test::Spec';
};
