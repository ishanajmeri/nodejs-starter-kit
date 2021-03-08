import React from 'react';
import { Card, CardMeta } from '@gqlapp/look-client-react';
import { Link } from 'react-router-dom';
import { userList_userList_edges_node } from '../../graphql/__generated__/userList';

const AVATAR = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';

// const p0 = 'M0,100 L25,100 C34,20 40,0 100,0';
// const ease0 = TweenOne.easing.path(p0);

interface ProfileCatalogueCardProps {
  item: userList_userList_edges_node;
  componentStyle: object;
}

const ProfileCatalogueCard: React.FunctionComponent<ProfileCatalogueCardProps> = props => {
  const { item } = props;
  return (
    <Link to={`/public-profile/${item.user ? item.user.id : item.id}`}>
      <Card
        style={props.componentStyle}
        align="left"
        cover={<img alt="" src={item.avatar || AVATAR} height="100%" />}
        className="catalogue-card profile-catalogue profile-catalogue-card"
        bodyStyle={{ padding: '0px 0px' }}
      >
        <CardMeta
          title={<h1>{`${item.profile && item.profile.firstName} ${item.profile && item.profile.lastName}`}</h1>}
        />
      </Card>
    </Link>
  );
};

export default ProfileCatalogueCard;
