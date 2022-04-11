package Mock::LWP::UserAgent;
use Mojo::Base 'LWP::UserAgent', -signatures;

use HTTP::Response;
use HTTP::Status ':constants';

has next_status_code => HTTP_OK;

sub new {
  return Mojo::Base::new(@_);
}

sub request {
  my $self = shift;
  return HTTP::Response->new($self->next_status_code);
}

1;
