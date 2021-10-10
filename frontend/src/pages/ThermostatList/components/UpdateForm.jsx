import React from 'react';
import { Button, Form, Input, Modal } from 'antd';

const UpdateForm = (props) => {
  const [form] = Form.useForm();


  return (
    <Modal
      visible={props.updateModalVisible}
      title="Update Thermostat"
      okText="Update"
      cancelText="Cancel"
      onCancel={props.onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            props.onSubmit(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{id: props.values.id, thermo: props.values.thermo }}
        autoComplete="off"
      >
         <Form.Item
          label="id"
          name="id"
        >
          <Input disabled />
        </Form.Item>
      
        <Form.Item
          label="thermo"
          name="thermo"
        >
          <Input />
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default UpdateForm;
