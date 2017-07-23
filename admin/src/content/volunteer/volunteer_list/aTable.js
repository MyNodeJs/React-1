
import React, { PropTypes,Component } from 'react';
import { 
	Table, 
	Input, 
	Icon, 
	Button, 
	Row,
	Col,
	Popconfirm, 
	Pagination,
	Menu, 
	Dropdown 
} from 'antd'
import appData from './../../../assert/Ajax';
import ACell from './aCell';
import  '../../../App.css'

require('./index.css');
export default class pointTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			count: 1,
			total:0,
			listMess:{},
			pageSum:1,
			pageNum:1,
		};

		this.columns = [
			{
				colSpan:1,
				title: 'ID',
				render:(text,record,index) => {
					return(
						<text>{index}</text>
					)
				}
			},
			{
				colSpan:1,
				title: '手机',
				dataIndex: 'mobile',
			},
			{
  				colSpan: 1,
				title: '姓名',
				dataIndex: 'name',
			}, 
			{
  				colSpan: 1,
				title: '性别',
				dataIndex: 'gender',
			}, 
			{
  				colSpan: 1,
				title: '居住类型',
				dataIndex: 'type',
				render:(text,record) => {
					let test = ''
					if(text === 'Y' ){
						test = '业主'
					}  else if(text === 'Z'){
						test = '租户'
					} 
					return <div>{test}</div>
				}
			}, 
			{
  				colSpan: 1,
				title: '地址',
				dataIndex: 'address',
			}, 
			// {
  			// 	colSpan: 1,
			// 	title: 'apt_info',
			// 	dataIndex: 'apt_info',
			// }, 
			// {
  			// 	colSpan: 1,
			// 	title: 'floor',
			// 	dataIndex: 'floor',
			// }, 
			// {
  			// 	colSpan: 1,
			// 	title: 'room',
			// 	dataIndex: 'room',
			// }, 
			{
				colSpan:1,
				title: 'EMAIL',
				dataIndex: 'email',
			},
			{
				colSpan:1,
				title: '志愿者类型',
				dataIndex: 'vol_tag ',
				// render:(text,record) => {
				// 	let test = ''
				// 	if(text === 1 ){
				// 		test = '社区服务'
				// 	} else if(text === 2){
				// 		test = '公益活动'
				// 	} else if(text === 3){
				// 		test = '其他'
				// 	}
				// 	return <div>{test}</div>
				// }
			}, 
			{
				colSpan:1,
				title: '志愿者星级',
				dataIndex: 'score',
			},
			{
				colSpan:1,
				title: '注册时间',
				dataIndex: 'register_date',
			},
			{
				title:"操作",
				key:"action",
  				colSpan: 3,
				render:(text, record)=>{
					return (
						<Row type="flex" justify="space-between">
							<Button onClick={() =>this._action('change',record)}>编辑</Button>
							<Button onClick={() =>this._action('cancel',record)}>注销</Button>
						</Row>
					)
				}
			}
		];
		
		this.Router;
		this.mess = null;
	}

	componentWillMount(){
		this.Router = this.props.Router;
		this.mess = this.props.message;
		appData._Storage('get',"userMess",(res) =>{
			this.userMess = res
			this._getEvent()
		})
	}

	_jump(nextPage,mess){
		this.Router(nextPage,mess,this.mess.nextPage)
	}

	//获取后台信息
	_getEvent(){
		let userMess = this.userMess;
		let afteruri = 'vcity/listuser';
		let body = {
			 "comm_code": userMess.comm_code
		}
		appData._dataPost(afteruri,body,(res) => {
			res.forEach((value)=>{
				value.address = value.comm_name + value.apt_info+value.floor+value.room
			})
			let pageSum = Math.ceil(res.length/res.per_page)
			let len = res.length;
			this.setState({
				total:res.length,
				dataSource: res,
				count:len,
			})
		})
	}
	
	//操作栏功能
	_action(type,mess){
		if(type === "change"){
			this._jump('volunteer_edit', mess)
		}else if(type === "cancel"){
			
		}
	}

	//分页器activity/list?page=num
	_pageChange(pageNumber){
		let userMess = this.userMess;
		let afteruri = 'activity/list?page=' + pageNumber ;
		let body = {
			 "comm_code": userMess.comm_code
		}
		appData._dataPost(afteruri,body,(res) => {
			let pageSum = Math.ceil(res.total/res.per_page)
			let data = res.data;
			let len = data.length;
			this.setState({
				total:res.total,
				dataSource: data,
				count:len,
				pageNum:pageNumber
			})
		})
	}

	render() {
		const { dataSource } = this.state;
		let columns = this.columns;
		return (
		<div>
			 <Table bordered dataSource={this.state.dataSource} columns={columns} rowKey='key' pagination={false} style={{marginBottom: 20}}/> 
			 <Row type="flex" justify="end">
			 	<Pagination showQuickJumper defaultCurrent={1} current={this.state.pageNum} total={this.state.total} onChange={this._pageChange.bind(this)} />
			 </Row>
		</div>
		);
	}
}