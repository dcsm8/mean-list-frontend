import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient) { }

  getPosts() {
    this.httpClient.get<{ message: string, posts: Post[] }>('http://localhost:3000/api/posts')
      .subscribe(({ posts }) => {
        this.posts = posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {
      id: null,
      title,
      content
    };

    this.httpClient.post('http://localhost:3000/api/posts', post)
      .subscribe((response) => {
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
