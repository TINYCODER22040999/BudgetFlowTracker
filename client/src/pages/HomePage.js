import React, { useEffect, useState, useCallback } from "react";
import { Form, Modal, Input, Select, message, Table, DatePicker } from "antd";
import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import Layout from "../components/Layout/Layout";
import axios from '../axiosConfig';
import moment from "moment";
import Spinner from "../components/Spinner";
import Analytics from "../components/Analytics";

const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModel, setShowModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alltransaction, setAlltransaction] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectedDate] = useState([]);
  const [type, setType] = useState("all");
  const [veiwData, setVeiwData] = useState("table");
  const [editable, setEditable] = useState(null);

  // fetch transactions
  const getAllTransaction = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      const response = await axios.post("/transactions/get-transaction", {
        userid: user._id,
        frequency,
        selectedDate,
        type,
      });
      setLoading(false);
      setAlltransaction(response.data);
    } catch (error) {
      setLoading(false);
      console.error(error);
      message.error("Error fetching transactions");
    }
  }, [frequency, selectedDate, type]);

  useEffect(() => {
    getAllTransaction();
  }, [getAllTransaction]);

  // delete transaction
  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post("/transactions/delete-transaction", {
        transactionId: record._id,
      });
      setLoading(false);
      message.success("Transaction Deleted Successfully");
      getAllTransaction(); // refresh after deletion
    } catch (error) {
      setLoading(false);
      console.error(error);
      message.error("Error deleting transaction");
    }
  };

  // form handling
  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      if (editable) {
        await axios.post("/transactions/edit-transaction", {
          payload: {
            ...values,
            userid: user._id,
          },
          transactionId: editable._id,
        });
        message.success("Transaction Updated Successfully");
      } else {
        await axios.post("/transactions/add-transaction", {
          ...values,
          userid: user._id,
        });
        message.success("Transaction Added Successfully");
      }
      setLoading(false);
      setShowModel(false);
      setEditable(null);
      getAllTransaction(); // refresh after submission
    } catch (error) {
      setLoading(false);
      console.error(error);
      message.error("Failed to add or update transaction");
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Reference",
      dataIndex: "reference",
    },
    {
      title: "Actions",
      render: (text, record) => (
        <div>
          <EditOutlined
            onClick={() => {
              setEditable(record);
              setShowModel(true);
            }}
          />
          <DeleteOutlined className="mx-2" onClick={() => handleDelete(record)} />
        </div>
      ),
    },
  ];

  return (
    <Layout>
      {loading && <Spinner />}
      <div className="filters">
        <div>
          <h6>Select Frequency</h6>
          <Select value={frequency} onChange={(values) => setFrequency(values)}>
            <Select.Option value="7">Last 1 Week</Select.Option>
            <Select.Option value="30">Last 1 Month</Select.Option>
            <Select.Option value="365">Last 1 Year</Select.Option>
            <Select.Option value="custom">Custom</Select.Option>
          </Select>
          {frequency === "custom" && (
            <RangePicker
              value={selectedDate}
              onChange={(values) => setSelectedDate(values)}
            />
          )}
        </div>
        <div>
          <h6>Select Type</h6>
          <Select value={type} onChange={(values) => setType(values)}>
            <Select.Option value="all">ALL</Select.Option>
            <Select.Option value="income">INCOME</Select.Option>
            <Select.Option value="expense">EXPENSE</Select.Option>
          </Select>
        </div>
        <div className="switch-icon">
          <UnorderedListOutlined
            className={`mx-2 ${veiwData === "table" ? "active-icon" : "inactive-icon"}`}
            onClick={() => setVeiwData("table")}
          />
          <AreaChartOutlined
            className={`mx-2 ${veiwData === "analytics" ? "active-icon" : "inactive-icon"}`}
            onClick={() => setVeiwData("analytics")}
          />
        </div>
        <button className="btn btn-primary" onClick={() => setShowModel(true)}>
          Add New
        </button>
      </div>
      <div className="content">
        {veiwData === "table" ? (
          <Table columns={columns} 
          dataSource={alltransaction.map((transaction) => ({ ...transaction, key: transaction._id }))}
           />
        ) : (
          <Analytics alltransaction={alltransaction} />
        )}
      </div>

      <Modal
        title={editable ? "Edit transaction" : "Add transaction"}
        open={showModel}
        onCancel={() => setShowModel(false)}
        footer={false}
      >
        <Form layout="vertical" onFinish={handleSubmit} initialValues={editable}>
          <Form.Item label="Amount" name="amount" rules={[{ required: true, message: 'Please enter amount' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Type" name="type" rules={[{ required: true, message: 'Please select a type' }]}>
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Please select a category' }]}>
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="tip">Tip</Select.Option>
              <Select.Option value="project">Project</Select.Option>
              <Select.Option value="movie">Movie</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="traveling">Traveling</Select.Option>
              <Select.Option value="fee">Fee</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Reference" name="reference">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Date" name="date" rules={[{ required: true, message: 'Please select a date' }]}>
            <Input type="date" />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              SAVE
            </button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
