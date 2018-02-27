import React from 'react';
import { Redirect } from 'react-router-dom';
import { graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';

import Header from '../components/Header';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';
import AppLayout from '../components/AppLayout';
import Sidebar from '../containers/Sidebar';
import { allTeamsQuery } from '../graphql/team';

const ViewTeam = ({ data: { loading, allTeams }, match: { params: { teamId, channelId } } }) => {
  if (loading) {
    return null;
  }
  if (allTeams.length < 1) {
    return <Redirect to="/create-team" />;
  }

  const teamIdInteger = parseInt(teamId, 11);
  const teamIdx = teamIdInteger ? findIndex(allTeams, ['id', teamIdInteger]) : 0;
  const team = allTeams[teamIdx];

  const channelIdInteger = parseInt(channelId, 11);
  const channelIdx = channelIdInteger ? findIndex(team.channels, ['id', channelIdInteger]) : 0;
  const channel = team.channels[channelIdx];

  return (
    <AppLayout>
      <Sidebar
        teams={allTeams.map(t => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase(),
        }))}
        team={team}
      />
      {channel && <Header channelName={channel.name} />}
      {channel && (
        <Messages channelId={channel.id}>
          <ul className="message-list">
            <li />
            <li />
          </ul>
        </Messages>
      )}
      {channel && <SendMessage channelName={channel.name} />}
    </AppLayout>
  );
};

export default graphql(allTeamsQuery)(ViewTeam);
