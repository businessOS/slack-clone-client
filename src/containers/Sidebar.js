import React from 'react';
import decode from 'jwt-decode';

import Channels from '../components/Channels';
import Teams from '../components/Teams';
import AddChannelModal from '../components/AddChannelModal';
import InvitePeoplelModal from '../components/InvitePeoplelModal';

export default class Sidebar extends React.Component {
  state = {
    openAddChannelModal: false,
    openInvitePeoplelModal: false,
  };

  handleCloseAddChannelModal = () => {
    this.setState({ openAddChannelModal: false });
  };

  handleAddChannelClick = () => {
    this.setState({ openAddChannelModal: true });
  };

  handleInvitePeopleClick = () => {
    this.setState({ openInvitePeoplelModal: true });
  };

  handleCloseInvitePeopleClick = () => {
    this.setState({ openInvitePeoplelModal: false });
  };

  render() {
    const { teams, team } = this.props;
    const { openInvitePeoplelModal, openAddChannelModal } = this.state;

    let username = '';
    try {
      const token = localStorage.getItem('token');
      const { user } = decode(token);
      // eslint-disable-next-line prefer-destructuring
      username = user.username;
    } catch (err) {
      // eslint-disable-next-line no-empty
    }

    return [
      <Teams key="team-sidebar" teams={teams} />,
      <Channels
        key="channels-sidebar"
        teamName={team.name}
        username={username}
        teamId={team.id}
        channels={team.channels}
        users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'user1' }]}
        onAddChannelClick={this.handleAddChannelClick}
        onInvitePeopleClick={this.handleInvitePeopleClick}
      />,
      <AddChannelModal
        teamId={team.id}
        onClose={this.handleCloseAddChannelModal}
        open={openAddChannelModal}
        key="sidebar-add-channel-modal"
      />,
      <InvitePeoplelModal
        teamId={team.id}
        onClose={this.handleCloseInvitePeopleClick}
        open={openInvitePeoplelModal}
        key="invite-people-modal"
      />,
    ];
  }
}
