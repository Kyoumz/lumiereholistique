import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent implements OnInit {
  status: 'success' | 'invalid' | 'pending' = 'pending';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const status = this.route.snapshot.queryParamMap.get('status');
    if (status === 'success') this.status = 'success';
    else if (status === 'invalid') this.status = 'invalid';
    else this.status = 'pending';
  }
}
