import { TestBed } from '@angular/core/testing';

import { VideosPodcastService } from './videos-podcast.service';

describe('VideosPodcastService', () => {
  let service: VideosPodcastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideosPodcastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
