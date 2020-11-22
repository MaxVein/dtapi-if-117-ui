import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable({
    providedIn: 'root',
})
export class GroupsService {
    sharingData = []

    constructor(private http: HttpClient, private snackBar: MatSnackBar) {}
    public saveData(data: any) {
        this.sharingData.push(data)
    }
    public getsharedData() {
        return this.sharingData
    }
    public logIn() {
        return this.http.post(`${environment.BASEURL}/Login/index`, {
            username: 'admin',
            password: 'dtapi_admin',
        })
    }
    public getData(entity, id?) {
        return this.http.get(
            `${environment.BASEURL}${entity}/getRecords/${id ? id : ''}`
        )
    }
    public delData(entity, id?) {
        return this.http.get(
            `${environment.BASEURL}${entity}/del/${id ? id : ''}`
        )
    }
    public insertData(entity, payload) {
        return this.http.post(
            `${environment.BASEURL}${entity}/insertData`,
            payload
        )
    }
    public updateData(entity, id, payload) {
        return this.http.post(
            `${environment.BASEURL}${entity}/update/${id}`,
            payload
        )
    }
    snackBarOpen(payload: string): any {
        return this.snackBar.open(payload, '', {
            duration: 1500,
        })
    }
}
