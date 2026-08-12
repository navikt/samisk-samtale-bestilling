import { Locale, localeString } from '../localization/localeUtils.js';
import { AlertBox } from './aksel.js';

export const Confirmation = ({ locale }: { locale: Locale }) => (
    <AlertBox variant="success" iconId="alert-icon-success" class="app-submit-info">
        {localeString('kvitteringTekst', locale)}
    </AlertBox>
);
