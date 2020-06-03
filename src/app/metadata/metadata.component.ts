import { Component, OnInit } from '@angular/core';
// import { urlMetadata } from 'node_modules/url-metadata/index';
// import * as urlMetadata from 'node_modules/url-metadata/index';
// import Metascraper from 'node_modules/scrape-meta';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// article parser
// import { extract } from 'article-parser';

interface Meta {
  title: string;
  description: string;
  imageUrl: string;
}

@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.css']
})
export class MetadataComponent implements OnInit {
  rawlist;
  title;
  description;
  image;
  url = 'https://stackoverflow.com/';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  //   Metascraper
  // .scrapeUrl('https://tl.net')
  // .then((metadata) => {
  //   console.log(metadata);
  //   return metadata;
  // });
    this.getHtml();
  }

  getHtml() {
    this.getRawData()
    .subscribe(
      data => {
        const temp = this.parseForMetadata(data);
        this.title = temp.title.replace(/"/g, '');
        this.description = temp.description.replace(/"/g, '');
        this.image = temp.imageUrl.replace(/"/g, '');
        console.log(data);
      },
      error => console.log(error)
    );
  }

  getRawData(): Observable<any> {
    const api = this.url;
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';
    return this.http.get(corsProxy + api, { responseType: 'text' });
  }

  parseForMetadata(html: string): Meta {
    const result: Meta = { title: '', description: '', imageUrl: ''};
    const re = /(?<=og:)[^<]*/g;
    const strings = [];

    // find meta tags and add them to result
    html.match(re).forEach(element => {
      if (element.includes('title')) {
        if (result.title === '') {
          result.title = this.removeCommon(element)
            .replace('title', '');
        }
      }
      if (element.includes('description')) {
        if (result.description === '') {
          result.description = this.removeCommon(element)
            .replace('description', '');
        }
      }
      if (element.includes('image')) {
        if (result.imageUrl === '') {
          result.imageUrl = this.removeCommon(element)
            .replace('image', '')
            .replace(/\s/g, '');
        }
      }
    });

    return result;
  }

  removeCommon(info: string): string {
    return (info
      .replace('content=', '')
      .replace('"', '')
      .replace(' ', '')
      .replace('/>', '')
      .replace('>', ''))
      .replace(/itemprop="[^"]*/g, '');
  }
}
