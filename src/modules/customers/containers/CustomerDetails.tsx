import gql from 'graphql-tag';
import { IUser } from 'modules/auth/types';
import { Spinner } from 'modules/common/components';
import { withProps } from 'modules/common/utils';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { CustomerDetails } from '../components';
import { queries } from '../graphql';
import {
  ActivityLogQueryResponse,
  CustomerDetailQueryResponse
} from '../types';

type Props = {
  id: string;
};

type FinalProps = {
  customerDetailQuery: CustomerDetailQueryResponse;
  customerActivityLogQuery: ActivityLogQueryResponse;
  currentUser: IUser;
} & Props;

class CustomerDetailsContainer extends React.Component<FinalProps, {}> {
  render() {
    const {
      id,
      customerDetailQuery,
      customerActivityLogQuery,
      currentUser
    } = this.props;

    if (customerDetailQuery.loading) {
      return <Spinner objective={true} />;
    }

    const taggerRefetchQueries = [
      {
        query: gql(queries.customerDetail),
        variables: { _id: id }
      }
    ];

    const updatedProps = {
      ...this.props,
      customer: customerDetailQuery.customerDetail || {},
      loadingLogs: customerActivityLogQuery.loading,
      activityLogsCustomer: customerActivityLogQuery.activityLogsCustomer || [],
      taggerRefetchQueries,
      currentUser
    };

    return <CustomerDetails {...updatedProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props, CustomerDetailQueryResponse, { _id: string }>(
      gql(queries.customerDetail),
      {
        name: 'customerDetailQuery',
        options: ({ id }: { id: string }) => ({
          variables: {
            _id: id
          }
        })
      }
    ),
    graphql<Props, ActivityLogQueryResponse, { _id: string }>(
      gql(queries.activityLogsCustomer),
      {
        name: 'customerActivityLogQuery',
        options: ({ id }: { id: string }) => ({
          variables: {
            _id: id
          }
        })
      }
    )
  )(CustomerDetailsContainer)
);
