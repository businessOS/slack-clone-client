import React from 'react';
import { Form, Button, Input, Modal } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';

const AddChannelModal = ({
  open,
  onClose,
  teamName,
  values,
  handelChange,
  handelBlur,
  handleSubmit,
  isSubmitting,
}) => (
  <Modal open={open} onClose={onClose}>
    <Modal.Header>{teamName}</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input
            values={values.name}
            onChange={handelChange}
            onBlur={handelBlur}
            name="name"
            fluid
            placeholder="Nombre del canal"
          />
        </Form.Field>
        <Form.Group widths="equals">
          <Button
            disabled={isSubmitting}
            onClick={onClose}
            fluid
          >
            Cancelar
          </Button>
          <Button
            disabled={isSubmitting}
            onClick={handleSubmit}
            fluid
          >
            Crear Canal
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

const createChannelMutation = gql`
  mutation ($teamId: Int!, $name: String!) {
    createChannel(teamId: $teamId, name: $name)
  }
`;

export default compose(
  graphql(createChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ name: '' }),
    validate: (values) => {
      const errors = {};
      if (!values.name) {
        errors.name = 'Requerido';
      }
      return errors;
    },
    handleSubmit: async (
      values,
      { prop: { onClose, teamId, mutate }, setSubmitting },
    ) => {
      const response = await mutate({ variables: { teamId, name: values.name } });
      // eslint-disable-next-line no-console
      console.log(response);
      onClose();
      setSubmitting(false);
    },
  }),
)(AddChannelModal);
