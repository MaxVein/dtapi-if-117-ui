import { Injectable } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Injectable()
export class ThemeService {
    constructor(private overlayContainer: OverlayContainer) {}

    initTheme(): string {
        const theme = localStorage.getItem('theme');
        if (theme) {
            this.overlayContainer.getContainerElement().classList.add(theme);
            return theme;
        } else {
            this.overlayContainer
                .getContainerElement()
                .classList.remove('dark-theme');
            return 'default-theme';
        }
    }

    onSetTheme(theme: string): string {
        localStorage.setItem('theme', theme);
        this.overlayContainer.getContainerElement().classList.add(theme);
        if (theme === 'default-theme') {
            this.overlayContainer
                .getContainerElement()
                .classList.remove('dark-theme');
        }
        return theme;
    }
}
