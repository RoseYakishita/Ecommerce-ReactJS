import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { SendContactDto } from './dto/send-contact.dto';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send contact message to site owner email' })
  send(@Body() payload: SendContactDto) {
    return this.contactService.sendMessage(payload);
  }
}
