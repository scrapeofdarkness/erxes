import gql from 'graphql-tag';
import { IRouterProps } from 'modules/common/types';
import { queries as tagQueries } from 'modules/tags/graphql';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import { withProps } from '../../common/utils';
import { TagsQueryResponse } from '../../tags/types';
import { Sidebar } from '../components';
import { queries } from '../graphql';
import { CountQueryResponse, TagCountQueryResponse } from '../types';

type Props = {
  queryParams: any;
};

type FinalProps = {
  kindCountsQuery: CountQueryResponse;
  statusCountsQuery: CountQueryResponse;
  tagsQuery: TagsQueryResponse;
  tagCountsQuery: TagCountQueryResponse;
} & IRouterProps;

const SidebarContainer = (props: FinalProps) => {
  const {
    kindCountsQuery,
    statusCountsQuery,
    tagsQuery,
    tagCountsQuery
  } = props;

  const updatedProps = {
    ...props,
    kindCounts: kindCountsQuery.engageMessageCounts || {},
    statusCounts: statusCountsQuery.engageMessageCounts || {},
    tags: tagsQuery.tags || [],
    tagCounts: tagCountsQuery.engageMessageCounts || {}
  };

  return <Sidebar {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, CountQueryResponse>(gql(queries.kindCounts), {
      name: 'kindCountsQuery',
      options: () => ({
        fetchPolicy: 'network-only'
      })
    }),
    graphql<Props, CountQueryResponse, { kind: string }>(
      gql(queries.statusCounts),
      {
        name: 'statusCountsQuery',
        options: ({ queryParams }) => ({
          variables: {
            kind: queryParams.kind || ''
          },
          fetchPolicy: 'network-only'
        })
      }
    ),
    graphql<Props, TagCountQueryResponse, { type: string }>(
      gql(tagQueries.tags),
      {
        name: 'tagsQuery',
        options: () => ({
          variables: { type: 'engageMessage' }
        })
      }
    ),
    graphql<Props, CountQueryResponse, { kind: string; status: string }>(
      gql(queries.tagCounts),
      {
        name: 'tagCountsQuery',
        options: ({ queryParams }) => ({
          variables: {
            kind: queryParams.kind || '',
            status: queryParams.status || ''
          },
          fetchPolicy: 'network-only'
        })
      }
    )
  )(withRouter<FinalProps>(SidebarContainer))
);
