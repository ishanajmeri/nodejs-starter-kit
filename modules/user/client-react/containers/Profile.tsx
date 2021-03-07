import React from 'react';

import { compose } from '@gqlapp/core-common';

import ProfileView from '../components/ProfileView.web';
// types
import { currentUser_currentUser as CurrentUser } from '../graphql/__generated__/currentUser';
import { withCurrentUser } from './UserOperations';

interface ProfileProps {
  currentUser: CurrentUser;
}

const Profile: React.FunctionComponent<ProfileProps> = props => {
  const { currentUser } = props;
  const { profile } = currentUser;
  const ProfileData = {
    id: currentUser.id,
    username: currentUser.role,
    role: currentUser.role,
    isActive: currentUser.isActive,
    email: currentUser.id,
    profile: {
      firstName: currentUser && profile && profile.firstName,
      lastName: currentUser && profile && profile.lastName,
      isVerified: true,
      isAvailable: true,
      website: 'www.google.com',
      about: 'web developer',
      designation: 'dev',
      avatar: currentUser.profile && currentUser.profile.avatar,
      rating: 5,
      responseTime: 35,
      acceptanceRate: 35,
      mobile: 8888888888,
      flag: 'good'
    },

    photoId: {
      image:
        'https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80',
      isVerified: true,
      error: 'null'
    },
    addresses: [
      {
        streetAddress1: 'aaaaaaaa',
        streetAddress2: 'bbbbbbb',
        city: 'ccccc',
        state: 'dddddd',
        pinCode: 'eeeeee'
      },
      {
        streetAddress1: 'wwaaaaaa',
        streetAddress2: 'wwwbbbbb',
        city: 'wwccc',
        state: 'wwdddd',
        pinCode: 'wweeee'
      }
    ],

    identification: {
      type: 'government',
      documentUrl:
        'https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80',
      isVerified: true,
      error: 'null'
    },
    verification: {
      isEmailVerified: true,
      isMobileVerified: false,
      isPhotoIdVerified: false,
      isAddressVerified: false,
      isIdVerified: true,
      isReferred: false
    },
    endorsements: [
      {
        id: 5,
        username: 'laluch',
        profile: {
          firstName: 'of',
          lastName: 'rebellion',
          avatar: 'null'
        }
      }
    ],
    endorsed: [
      {
        id: 5,
        username: 'laluch',
        profile: {
          firstName: 'of',
          lastName: 'rebellion',
          avatar: 'null'
        }
      }
    ],
    followers: [
      {
        id: 5,
        username: 'laluch',
        profile: {
          firstName: 'of',
          lastName: 'rebellion',
          avatar: 'null'
        }
      }
    ],
    following: [
      {
        id: 5,
        username: 'laluch',
        profile: {
          firstName: 'of',
          lastName: 'rebellion',
          avatar: 'null'
        }
      }
    ],

    portfolios: [
      {
        platform: 'google',
        portfolioUrl: 'www.google.com'
      }
    ]
    // authCertificate {
    //   serial
    // }
    // authFacebook {
    //   fbId
    //   displayName
    // }
    // authGoogle {
    //   googleId
    //   displayName
    // }
    // authGithub {
    //   ghId
    //   displayName
    // }
    // authLinkedin {
    //   lnId
    //   displayName
    // }
  };
  return <ProfileView {...props} currentUser={ProfileData} />;
};

export default compose(withCurrentUser)(Profile);
