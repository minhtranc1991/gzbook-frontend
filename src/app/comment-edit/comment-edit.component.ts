import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../service/user.service';
import {PostService} from '../service/post.service';
import {TokenStorageService} from '../service/token-storage.service';
import {CommentService} from '../service/comment.service';
import {IComment} from '../model/IComment';
import {NgForm} from '@angular/forms';
import swal from 'sweetalert';

@Component({
  selector: 'app-comment-edit',
  templateUrl: './comment-edit.component.html',
  styleUrls: ['./comment-edit.component.scss']
})
export class CommentEditComponent implements OnInit {

  constructor(private userService: UserService,
              private postService: PostService,
              private tokenStorage: TokenStorageService,
              private commentService: CommentService
  ) { }

  ngOnInit(): void {
  }

  @Input() comment: IComment;

  editComment(form: NgForm) {
    this.comment.content = form.value.content;
    this.comment.edited = 1;
    this.commentService.updateComment(this.comment.id, this.comment).subscribe(
      res => {
        swal({
          icon: 'success',
          title: 'Bình luận của bạn đã được thay đổi!'
        });
      }
  )
  }
}
