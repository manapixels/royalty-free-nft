import {
  NewIpNft as NewIpNftEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
} from "../../generated/IpNftFactory/Factory"
import {
  IpNft,
  OwnershipTransferred,
} from "../../generated/schema"



export function handleNewIpNft(event: NewIpNftEvent): void {
  let entity = new IpNft(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.address = event.params.IpNftContractAddress.toHexString()
  entity.licensor = event.params.licensor.toHexString()
  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.save()
}


