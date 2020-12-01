import { TestBed } from '@angular/core/testing';

import { AdminsCrudService } from './admins.service';

describe('AdminsCrudService', () => {
    let service: AdminsCrudService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AdminsCrudService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
