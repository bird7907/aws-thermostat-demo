import React from 'react';
import { Button, Form, Input, Modal } from 'antd';

const UpdateForm = (props) => {
  const [form] = Form.useForm();


  return (
    <Modal
      visible={props.updateModalVisible}
      title="Update"
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
        initialValues={{ thermo: props.values.thermo }}
        autoComplete="off"
      >
         <Form.Item
          label="id"
          name="id"
        >
          <Input />
        </Form.Item>
        props.values.id
        <Form.Item
          label="Thermo"
          name="thermo"
        >
          <Input />
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default UpdateForm;
