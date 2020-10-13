import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UsersService} from '../service/friend/users.service';
import {PostService} from '../service/post.service';
import {TokenStorageService} from '../service/token-storage.service';
import {CommentService} from '../service/comment.service';
import {IUser} from '../model/IUser';
import {IPost} from '../model/IPost';
import {IComment} from '../model/IComment';
import {NgForm} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {

  constructor(private userService: UsersService,
              private postService: PostService,
              // private likeCommentService: LikeCommentService,
              private tokenStorage: TokenStorageService,
              private commentService: CommentService) { }

  ngOnInit(): void {
    this.getCommentList();
    this.userService.getUser().subscribe(
      res=>{
        this.userLogin = <IUser>res;
      }
    )
    this.postService.getPostById(this.postId).subscribe(
      res=>{
        this.post = <IPost>res;
      }
    )
  }
  @Output() newComment = new EventEmitter();
  @Output() delComment = new EventEmitter();
  @Input() postId;
  commentList: IComment[];

  userLogin: IUser;
  post : IPost;

  getCommentList() {
    this.commentService.getCommentByPostId(this.postId).subscribe(
      commentList => {
        this.commentList = <IComment[]> commentList;
        for (let i = 0; i < this.commentList.length; i++) {
          this.userService.findUserById(this.commentList[i].userId).subscribe(
            res => {
              let commenter = <IUser> res;
              this.commentList[i].commenterName = commenter.username;
              this.commentList[i].commenterAvatar = commenter.avatarUrl;
            })
        }
      }
    )
  }

  deleteComment(commentId: number,index : number) {
    Swal.fire({
      title: 'Bạn muốn xóa bình luận này?',
      text: "Bạn sẽ không thể hoàn tác!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Đồng ý, xóa bình luận!'
    })
      .then((result) => {
          if (result.value) {
            Swal.fire(
              'Đã xóa!',
              'Bình luận đã được xóa',
              'success'
            );
            this.commentService.deleteComment(commentId).subscribe(
              res => {this.getCommentList();
                this.delComment.emit(index);
              }
            )
          }
        }
      )
  }

  idCommentEdit:number;
  indexEdit: number;
  comment: IComment;

  getIdComment(commentId: number, i: number) {
    this.idCommentEdit= commentId;
    this.indexEdit=i;
  }

  onSubmit(form: NgForm) {
    this.commentService.getCommentById(this.idCommentEdit).subscribe(
      resPost => {
        this.comment = <IComment> resPost;
        this.comment.content = form.value.content;
        this.commentService.updateComment(this.idCommentEdit,this.comment).subscribe(
          resPost => {
            for (let i = 0 ; i<= this.commentList.length; i++){
              if (i == this.indexEdit){
                this.commentList[i].content = form.value.content;
              }
            }
          }
        )
      }
    )
  }

  addNewComment(value) {
    this.newComment.emit(value);
    this.getCommentList();
  }

  isExpanded = false;

  expandItems() {
    this.isExpanded = true;
  }

  hideItems() {
    this.isExpanded = false;
  }
}