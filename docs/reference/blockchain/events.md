# Unique Pallet - Events

When someone requests unique blockchain to perform some action,
the result is usually being emitted 
as a bunch of Substrate events.

Substrate event has section, method and arguments. In addition to basic Substrate events
(balances.Transfer and so on) unique network has such custom events:


Collection-related events:

| Section              | Event                     |
|----------------------|---------------------------|
| common               | CollectionCreated         |
| common               | CollectionDestroyed       |
| common               | CollectionPropertyDeleted |
| common               | CollectionPropertySet     |
| common               | PropertyPermissionSet     |
| unique               | AllowListAddressAdded     |
| unique               | AllowListAddressRemoved   |
| unique               | CollectionAdminAdded      |
| unique               | CollectionAdminRemoved    |
| unique               | CollectionLimitSet        |
| unique               | CollectionOwnedChanged    |
| unique               | CollectionPermissionSet   |
| unique               | CollectionSponsorRemoved  |
| unique               | CollectionSponsorSet      |
| unique               | SponsorshipConfirmed      |


Token-related events:

| Section              | Event                |
|----------------------|----------------------|
| common               | Approved             |
| common               | ItemCreated          |
| common               | ItemDestroyed        |
| common               | TokenPropertyDeleted |
| common               | TokenPropertySet     |
| common               | Transfer             |



