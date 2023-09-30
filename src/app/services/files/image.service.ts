import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }

  saveImage(image: File) {
    const formData = new FormData();
    formData.append("file", image);
    return this.http.post(`${environment.API_URL}upload/image`, formData, { observe: "response" }).pipe(take(1))
  }

  deleteImage(imageId: string) { 
    return this.http.delete(`${environment.API_URL}delete/image/${imageId}`)
  }
}
